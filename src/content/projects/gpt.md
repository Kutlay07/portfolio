## The problem

Using a pretrained language model does not explain how it works. This project builds a GPT-style decoder-only Transformer in PyTorch to connect the mathematics of attention and next-token prediction to a working implementation.

## Architecture

The implementation includes token embeddings, causal multi-head self-attention, rotary position embeddings, RMSNorm, a SwiGLU feed-forward network, residual connections, and a weight-tied output head. Attention uses PyTorch's scaled dot-product attention API; the actual attention backend depends on the hardware and runtime.

![GPT architecture from the source project](/project-media/gpt-architecture.png)

The checked configuration uses 12 layers, 12 attention heads, an embedding size of 768, a vocabulary of 50,257 tokens, and a training block size of 128.

## Training and generation

The documented pipeline uses WikiText-2 with GPT-2 BPE tokenization. It includes AdamW, a warmup and cosine learning-rate schedule, mixed precision, gradient clipping, validation, and checkpoint resume.

Generation supports greedy decoding, temperature, top-k and top-p sampling, plus a key/value cache. A separate Hugging Face wrapper provides configuration and model export without replacing the original implementation.

## Reported results

The project's README reports the following best validation metrics:

| Metric | Reported result |
| --- | --- |
| Validation loss | 2.2648 |
| Perplexity | 9.63 |

![Validation loss across the training sessions recorded in the project](/project-media/gpt-training-curve.png)

These values and the chart come from the source project's records. They were not independently reproduced for this portfolio, are not held-out test results, and should not be treated as a comparison with other language models. Tokenization, data splitting, and evaluation settings affect the interpretation of both metrics.

## What I learned

Implementing the components directly makes tensor shapes, causal masking, normalization, sampling, and the difference between training and cached generation concrete. Checkpointing and export also turn a model experiment into something that can be resumed and reused.

The current educational implementation is complete; longer context, larger-scale training, and additional architectural experiments remain future work. ChessGPT is a separate idea and is not represented as a completed project here.

## Explore the implementation

Read the [source and reported training results](https://github.com/Kutlay07/GPT-From-Scratch), [model implementation](https://github.com/Kutlay07/GPT-From-Scratch/blob/master/gpt_model.py), and [configuration](https://github.com/Kutlay07/GPT-From-Scratch/blob/master/config.py).
