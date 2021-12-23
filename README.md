## nextjs-ssr-experiment

### Example Usage:
```javascript
import {ExperimentProvider, Experiment, Variant} from "nextjs-ssr-experiment";

<ExperimentProvider>
    <Experiment
        name="homepage"
        onRunExperiment={console.log}
    >
        <Variant name="variant-a" weight={75}>
            <h1>Variant A</h1>
            <p>Some cool variant A content</p>
        </Variant>
        <Variant name="variant-b" weight={25}>
            <h1>Variant B</h1>
            <p>Some really different variant B copy</p>
        </Variant>
    </Experiment>
</ExperimentProvider>
```

### browser based experiment/variant debug
You can add the experiment name into the url in order to get some modal debug data:

https://yoursite.com/?experiment_homepage_debug=1

^^ where 'homepage' is replaced with whatever experiment you're running.


## Development Notes

### yalc for local develpment
```bash
yalc publish --replace --push
```
