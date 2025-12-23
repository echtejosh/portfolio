import { Link } from 'react-router-dom'
import { MermaidDiagram } from '../components/MermaidDiagram'
import { Container } from '../components/Container'

export function BlogPostPage() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <Container className="relative pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto w-full max-w-[760px]">
          <Link
            to="/blog"
            className="text-sm tracking-tight text-white/60 transition hover:text-white"
          >
            ← Back to blog
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            {['AI', 'Pipelines', 'Validation', 'Architecture'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-xs tracking-tight text-white/70 ring-1 ring-inset ring-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="instrument-serif-regular mt-8 text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
            Building a Scalable Pipeline for Technical Manual Processing
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            I began researching a proof of concept for the best approach to retrieving data from technical manuals to provide
            maintenance instructions for engineers who depend on these documents. I needed to prove whether it was possible to build a reliable system that could handle
            a large volume of diverse documents while producing consistent and accurate data.
          </p>

          <div className="mt-10 grid gap-10 text-sm leading-relaxed text-white/70 sm:text-base">
            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Initial Implementation
              </h2>
              <p>
                The first iteration of the pipeline was designed as a single-pass process that handled all the work in one go.
                This meant we first ingested the manuals, generated embeddings for retrieval, and then used those embeddings to retrieve relevant information without any intermediate staging.
                This approach worked for a small number of documents, but as we scaled up, the results became inconsistent and unreliable due to the complexity and variability of the manuals.
                I realized that a more structured approach was needed to ensure consistency and accuracy.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                The Instruction Design Problem
              </h2>
              <p>
                During testing, I discovered an interesting tradeoff. When I provided more guidance to the model through detailed instructions,
                it improved consistency at each step but reduced determinism and accuracy. When I tried simpler instructions, accuracy improved,
                but consistency got reduced instead. The issue wasn't how the instructions were written, it was that I was trying to solve too many problems at once with a single model.
                I needed to break down the tasks into smaller, more refined steps by introducing specialized models for each responsibility, with each model handling a specific task.
                This approach ensured that each step was handled with the appropriate level of detail and accuracy.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Why Debugging Was Difficult
              </h2>
              <p>
                Single-pass pipeline runs made debugging nearly impossible. Without intermediate inspection points, I
                couldn't isolate where things went wrong, only the final output was visible. If the output was incorrect, there was no way to tell whether the error stemmed from
                misinterpretation, faulty extraction, or aggregation issues. This lack of visibility made it difficult to improve the system systematically.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Moving to Checkpoints
              </h2>
              <p>
                I then separated each responsibility of the pipeline: extraction, transformation, and aggregation into distinct checkpoints.
                Documents now move through small, validated stages that can be rerun independently, making it much easier to trace failures to specific stages.
                The new multi-pass pipeline introduced three checkpoints:
              </p>

              <div className="border-y border-white/10">
                <div className="divide-y divide-white/10 lg:grid lg:grid-flow-col lg:divide-y-0 lg:divide-x lg:divide-white/10">
                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">1. Extraction</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>
                        Extracts structured information from unstructured manuals using different strategies depending on document type.
                      </div>
                    </div>
                  </div>

                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">2. Transformation</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>
                        Converts the extracted structure into target data models while applying domain-specific rules.
                      </div>
                    </div>
                  </div>

                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">3. Aggregation</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>
                        Combines outputs from individual documents and runs cross-document validation checks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Making Validation Practical
              </h2>
              <p>
                The checkpoint approach made human-in-the-loop validation actually possible between stages within the pipeline.
                Instead of reviewing only the final output, reviewers can now inspect the output of each checkpoint by either logging the output or storing it in a database. This prevents bad data from flowing into downstream stages,
                which previously resulted in cascading errors.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Scaling the System
              </h2>

              <MermaidDiagram
                definition={`flowchart TB
  Client[Client] -->|uploads document| API[API service]
  API -->|stores file| Bucket[Storage bucket]
  API -->|publishes job| Bus[Event bus]

  Bus --> Pipeline[AI pipeline service]
  Bucket -->|provides file| Pipeline

  Pipeline -->|provides data| Client2[Client]
`}
                className="w-full"
              />

              <p className="pl-4 text-sm leading-relaxed text-white/55">
                The pipeline is orchestrated through an event-driven architecture. Documents are uploaded via an API service that stores files in a storage bucket and publishes processing jobs to an event bus.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Separating Model Responsibilities
              </h2>
              <p>
                Since we process each responsibility with individual models, having one model handle planning, another handle interpretation, and a third handle domain
                knowledge and validation simultaneously provided much better results. Each model could focus on its specific task without losing context from task switching.
                The new pipeline assigns three distinct roles to models at each checkpoint:
              </p>

              <div className="border-y border-white/10">
                <div className="divide-y divide-white/10 lg:grid lg:grid-flow-col lg:divide-y-0 lg:divide-x lg:divide-white/10">
                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">Orchestrator AI</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>Determines what needs to happen at each checkpoint.</div>
                    </div>
                  </div>

                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">Expert AI</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>Applies business and domain rules during validation.</div>
                    </div>
                  </div>

                  <div className="group px-6 py-8 transition hover:bg-white/[0.02] lg:px-8">
                    <div className="text-sm font-semibold tracking-tight text-white">Visual AI</div>
                    <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/70">
                      <div>
                        Provides detailed descriptions of document content to give the Expert AI contextual information.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                Pipeline Walkthrough
              </h2>
              <p>
                Documents move through checkpointed stages that can be rerun independently. At each checkpoint, artifacts are written
                that the next checkpoint consumes, allowing us to relay information between stages beyond the models' immediate communication with each other.
              </p>

              <MermaidDiagram
                definition={`flowchart TB
  Core[Orchestrator AI per request] --> Extract[Checkpoint: extraction]
  Extract --> Transform[Checkpoint: transformation]
  Transform --> Aggregate[Checkpoint: aggregation]

  Extract -->|artifact| Store1[Artifact store]
  Transform -->|artifact| Store2[Artifact store]
  Aggregate -->|final outputs| Store3[Artifact store]
`}
                className="w-full"
              />
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                What We Ended Up With
              </h2>
              <p>
                The end result is a pipeline that behaves consistently under load, traces failures to specific stages, prevents error cascades through
                validation boundaries, and handles parallel processing. Each checkpoint is independently rerunnable, making debugging and improvements manageable.
                This modular architecture also allows for easier updates and optimizations to individual stages without disrupting the entire pipeline.
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="instrument-serif-regular text-2xl leading-[1.1] tracking-tight text-white sm:text-3xl">
                The Main Takeaway
              </h2>
              <p>
                Providing clear boundaries between each responsibility for the models is crucial. The fix usually isn't more sophisticated prompting or better instructions;
                it's establishing clearer separation of concerns, ensuring you get expected outputs at every step, and making these outputs debuggable. Consistency and idempotency should be built into the architecture, not
                something you rely on models to achieve on their own. Thank you for reading and I hope I have provided some useful insights into building reliable LLM pipelines. Until next time!
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  )
}