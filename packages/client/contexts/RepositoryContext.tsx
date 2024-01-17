import { JournalType, PushType, RepositoryType, TaskType } from "@client/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RepositoryContextType = {
  repositories: RepositoryType[];
  bookmarks: JournalType[];
  setBookmarks: (bookmarks: JournalType[]) => void;
  journals: JournalType[];
  setJournals: (journals: JournalType[]) => void;
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  pushList: PushType[];
  currentRepository: RepositoryType;
  changeRepository: (repo: RepositoryType) => void;
};

type Props = {
  children: ReactNode;
};

const RepositoryContext = createContext<RepositoryContextType>(undefined);

function RepositoryProvider({ children }: Props) {
  const [currentRepository, setCurrentRepository] =
    useState<RepositoryType>(null); // ["repo1", "repo2"
  const [initialState, setInitialState] = useState(null); // ["repo1", "repo2"
  const [repositories, setRepositories] = useState<Array<RepositoryType>>([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [pushList, setPushList] = useState([]); // ["repo1", "repo2"
  const [journals, setJournals] = useState([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  function changeRepository(repo: RepositoryType) {
    setCurrentRepository(repo);
  }

  useEffect(() => {
    const fetchedData = {
      repositories: [
        {
          name: "repo1",
          repoId: "12345",
          repositoryInfo: {
            description: "A simple task tracker",
            languages: ["TypeScript", "React", "Node.js", "MongoDB"],
          },
          hasAlerts: true,
        },
        {
          name: "repo2",
          repoId: "12344",
          repositoryInfo: {
            description: "An issue tracker",
            languages: ["TypeScript", "React", "Node.js", "MongoDB"],
          },
          hasAlerts: false,
        },
      ],
      commits: [
        {
          message: "Fix bug in task component",
          date: "2021-01-02",
          commit_sha: "0987654321",
        },
        {
          message: "Refactor code for better performance",
          date: "2021-01-03",
          commit_sha: "5678901234",
        },
      ],
      pushList: [
        {
          pushId: "12235",
          pushAt: "2021-01-01",
          commits: [
            {
              message: "Fix bug in task component",
              date: "2021-01-02",
              commit_sha: "0987654321",
            },
            {
              message: "Refactor code for better performance",
              date: "2021-01-03",
              commit_sha: "5678901234",
            },
          ],
        },
        {
          pushId: "12345",
          pushAt: "2021-02-01",
          commits: [
            {
              message: "Fix bug in task component",
              date: "2021-01-02",
              commit_sha: "0987654321",
            },
            {
              message: "Refactor code for better performance",
              date: "2021-01-03",
              commit_sha: "5678901234",
            },
          ],
        },
      ],
      bookmarks: [
        {
          title: "React",
          content:
            "This is about React. React is a JavaScript library for building user interfaces.",
          commits: [
            {
              message: "Add a new feature",
              date: "2021-01-01",
              commit_sha: "1234567890",
            },
          ],
          tasks: [
            {
              name: "Task 1",
              checklist: [
                {
                  checklistId: "12345",
                  description: "check 1",
                  checked: false,
                },
                {
                  checklistId: "12346",
                  description: "check 2",
                  checked: true,
                },
              ],
              progress: "Open",
              difficulty: "easy",
              taskId: "12347",
            },
          ],
        },
      ],
      journals: [
        {
          title: "React",
          content:
            "This is about React. React is a JavaScript library for building user interfaces.",
          commits: [
            {
              message: "Add a new feature",
              date: "2021-01-01",
              commit_sha: "1234567890",
            },
          ],
          tasks: [
            {
              name: "Task 1",
              checklist: [
                {
                  checklistId: "12345",
                  description: "check 1",
                  checked: false,
                },
                {
                  checklistId: "12346",
                  description: "check 2",
                  checked: true,
                },
              ],
              progress: "Open",
              difficulty: "easy",
              taskId: "12347",
            },
          ],
        },
      ],
      tasks: [
        {
          name: "Task 1",
          checklist: [
            {
              checklistId: "12345",
              description: "check 1",
              checked: false,
            },
            {
              checklistId: "12346",
              description: "check 2",
              checked: true,
            },
          ],
          progress: "Open",
          difficulty: "easy",
          taskId: "12347",
        },
        {
          name: "Task 2",
          checklist: [
            {
              checklistId: "12348",
              description: "check 1",
              checked: true,
            },
            {
              checklistId: "12349",
              description: "check 2",
              checked: true,
            },
          ],
          progress: "In-Progress",
          difficulty: "medium",
          taskId: "12348",
        },
        {
          name: "Task 3",
          checklist: [
            {
              checklistId: "12350",
              description: "check 1",
              checked: false,
            },
            {
              checklistId: "12351",
              description: "check 2",
              checked: false,
            },
          ],
          progress: "Done",
          difficulty: "hard",
          taskId: "12349",
        },
      ],
    };
    if (!fetchedData.repositories.length) return;
    setCurrentRepository(fetchedData.repositories[0]);
    setInitialState(fetchedData);
  }, []);

  useEffect(() => {
    if (!currentRepository) return;

    if (currentRepository.repoId === "12345") {
      setRepositories(initialState.repositories);
      setBookmarks(initialState.bookmarks);
      setJournals(initialState.journals);
      setPushList(initialState.pushList);
      setTasks(initialState.tasks);
      return;
    }

    if (currentRepository) {
      setBookmarks([]);
      setPushList([]);
      setJournals([]);
      setTasks([]);
    }
  }, [currentRepository]);

  const value: RepositoryContextType = useMemo(
    () => ({
      pushList,
      currentRepository,
      changeRepository,
      repositories,
      bookmarks,
      setBookmarks,
      journals,
      setJournals,
      tasks,
      setTasks,
    }),
    [repositories, bookmarks, journals, tasks, currentRepository, pushList]
  );

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error(
      "useRepositoryContext must be used within a RepositoryProvider",
    );
  }
  return context;
}

export default RepositoryProvider;
