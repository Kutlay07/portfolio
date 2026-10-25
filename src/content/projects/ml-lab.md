## The problem

Before a model can be trusted, its data needs to be understood. Applied ML Lab is a growing workspace for practicing that process on real datasets: inspect the raw records, investigate suspicious values, document decisions, and make the analysis repeatable.

## Current work

The repository currently contains a data-exploration module and a data-cleaning module. The exploration module has a download script and a notebook; the cleaning module has a separate notebook. Its learning tracker marks the first exploration module complete and the cleaning module in progress.

| Stage | Current scope |
| --- | --- |
| Exploration | Inspect columns, types, distributions, timestamps, and missing data |
| Cleaning | Investigate duplicates, malformed values, and consistency issues |
| Modeling | A later stage in the learning roadmap |
| Serving and deployment | Future engineering work |

## Method

The focus is on explaining data decisions rather than applying transformations blindly. A repeatable workflow starts with the source data, identifies a concrete quality issue, records the decision, and checks the resulting dataset.

The code and notebooks are the evidence for the current stage. Predictive models, a production API, and cloud infrastructure are roadmap items rather than completed deliverables.

## Evaluation and limits

There is no predictive model score to report for this lab yet. At this stage, useful evidence is a reproducible analysis, explicit data-quality checks, and documented cleaning choices.

Future modeling reports should state the target, dataset version, train/validation boundaries, baseline, metric, and limitations. A plausible-looking score without that context would not demonstrate a reliable model.

## What I am learning

- How exploratory analysis turns unfamiliar records into a concrete problem.
- Why data quality and leakage affect the validity of later model results.
- How to keep notebooks understandable and rerunnable.
- How to distinguish an experiment from a production pipeline.

## Explore the work

See the [source repository](https://github.com/Kutlay07/data-ml-lab) and its [learning tracker](https://github.com/Kutlay07/data-ml-lab/blob/main/learning-modules.md). The tracker separates current deliverables from the longer roadmap.
