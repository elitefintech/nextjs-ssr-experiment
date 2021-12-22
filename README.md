## nextjs-ssr-experiment

#### Example Usage:
```typescript
import {ExperimentProvider, Experiment, Variant} from "nextjs-ssr-experiment";

<ExperimentProvider>
    <Experiment
        name="experiment-name"
        debugUriParam="experiment_debug=true"
        onClick={console.log}
        onRunExperiment={console.log}
    >
        <Variant name="A" onClick={console.log}>
            <h1>Headline 1</h1>
        </Variant>
        <Variant name="B" onClick={console.log}>
            <h1>Headline 2</h1>
        </Variant>
    </Experiment>
</ExperimentProvider>
```
