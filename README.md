## nextjs-ssr-experiment

#### Example Usage:
```javascript
import {ExperimentProvider, Experiment, Variant} from "nextjs-ssr-experiment";

<ExperimentProvider>
    <Experiment
        name="homepage"
        onRunExperiment={console.log}
    >
        <Variant name="variant-a">
            <h1>Variant A</h1>
            <p>Some cool variant A content</p>
        </Variant>
        <Variant name="variant-b">
            <h1>Variant B</h1>
            <p>Some really different variant B copy</p>
        </Variant>
    </Experiment>
</ExperimentProvider>
```

#### yalc for local develpment
```bash
yalc publish --replace --push
```
