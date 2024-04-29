import { FeatureExtractionPipeline, pipeline, env } from '@xenova/transformers';

env.customCache = {
    match: () => false,
    put: () => {},
}

env.useCustomCache = true
env.useBrowserCache = false

env.allowLocalModels = false

let extractFeatures: FeatureExtractionPipeline;

const init = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {quantized:true}).then((model) => {
    extractFeatures = model
})

self.onmessage = async (event) => {
    if (!extractFeatures) {
        await init
    }
    const features = await extractFeatures(event.data.input, { pooling: 'mean', normalize: true })
    self.postMessage({correlationId: event.data.correlationId, output: JSON.stringify(features)})
}
