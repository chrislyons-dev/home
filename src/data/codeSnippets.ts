export interface CodeSnippet {
  language: string;
  code: string;
}

export const codeSnippets: CodeSnippet[] = [
  {
    language: 'TypeScript',
    code: `const buildGreatThings = async () => {
  const idea = await brainstorm();
  const architecture = design(idea);
  const product = implement(architecture);

  return ship(product);
};`,
  },
  {
    language: 'Python',
    code: `def solve_problem(challenge):
    approach = analyze(challenge)
    solution = code(approach)
    return optimize(solution)`,
  },
  {
    language: 'JavaScript',
    code: `const craftSolution = (problem) => {
  const plan = break_down(problem);
  const code = write(plan);
  return test(code) ? deploy(code) : refactor(code);
};`,
  },
];
