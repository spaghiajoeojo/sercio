import { Tensor } from "@xenova/transformers";
import Worker from "./feature-extraction-worker?worker";

const worker = new Worker();
const tasks = new Map();

worker.onmessage = (event) => {
    const resolve = tasks.get(event.data.correlationId);
    const obj: Tensor = JSON.parse(event.data.output)
    const vec: number[] = Array.from(Object.values(obj.data))
    resolve(vec);
}

export const embeddings = (input: string) => new Promise<number[]>((resolve) => {
    const correlationId = `${Date.now()}-${btoa(input)}}`;
    tasks.set(correlationId, resolve);
    worker.postMessage({ correlationId, input });
})
