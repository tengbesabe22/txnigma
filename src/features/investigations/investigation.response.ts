import type { streamInvestigation } from "./investigation.service";

// useObject reads streamed JSON. Keep the completion marker outside model control.
export function investigationResponse(
  result: ReturnType<typeof streamInvestigation>,
  cancellation: AbortController,
  requestId: string,
) {
  const encoder = new TextEncoder();
  let cancelled = false;
  return new Response(
    new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (text: string) => {
          if (!cancelled) controller.enqueue(encoder.encode(text));
        };
        try {
          send('{"analysis":');
          for await (const text of result.textStream) send(text);
          await result.output;
          if (
            cancellation.signal.aborted ||
            (await result.finishReason) !== "stop"
          ) {
            throw new Error("Incomplete generation");
          }
          send(',"status":"complete"}');
          if (!cancelled) controller.close();
        } catch (error) {
          console.error("Investigation stream failed", {
            requestId,
            category: error instanceof Error ? error.name : "UnknownError",
          });
          // A failed stream must reject in useObject, rather than look complete.
          if (!cancelled) controller.error(new Error("Investigation failed"));
        }
      },
      cancel() {
        cancelled = true;
        cancellation.abort();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Content-Type-Options": "nosniff",
        "X-Accel-Buffering": "no",
        "X-Request-ID": requestId,
      },
    },
  );
}
