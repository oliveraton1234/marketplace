import { createContext, useContext, useState, type ReactNode } from 'react';

import { createRepositories, type Repositories } from './repositories';

const RepositoriesContext = createContext<Repositories | null>(null);

/** Provides the repository graph. Tests can inject fakes through `value`. */
export function RepositoriesProvider({ children, value }: { children: ReactNode; value?: Repositories }) {
  const [repositories] = useState(() => value ?? createRepositories());
  return <RepositoriesContext.Provider value={repositories}>{children}</RepositoriesContext.Provider>;
}

export function useRepositories(): Repositories {
  const repositories = useContext(RepositoriesContext);
  if (!repositories) throw new Error('useRepositories must be used inside <RepositoriesProvider>');
  return repositories;
}
