import { JournalType, PushType, RepositoryType, TaskType } from "@client/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useFetchRepositoryByIdQuery,
  useFetchRepositoryQuery,
} from "@client/store";

type RepositoryContextType = {
  repositories: RepositoryType[];
  updateRepositoryAlertById: (id: string) => void;
  bookmarks: JournalType[];
  setBookmarks: (bookmarks: JournalType[]) => void;
  journals: JournalType[];
  setJournals: (journals: JournalType[]) => void;
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  pushList: PushType[];
  setPushList: ((args: (pushList: PushType[])=>PushType[]) => void);
  currentRepository: RepositoryType;
  changeRepository: (repo: RepositoryType) => void;
  allLoading: boolean;
};

type Props = {
  children: ReactNode;
};

const RepositoryContext = createContext<RepositoryContextType>(undefined);

function RepositoryProvider({ children }: Props) {
  const [currentRepository, setCurrentRepository] =
    useState<RepositoryType>(null); // ["repo1", "repo2"
  const [repositories, setRepositories] = useState<Array<RepositoryType>>([]);
  const [bookmarks, setBookmarks] = useState<JournalType[]>([]);
  const [pushList, setPushList] = useState<PushType[]>([]); // ["repo1", "repo2"
  const [journals, setJournals] = useState<JournalType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { data: repos, isLoading } = useFetchRepositoryQuery();
  const {
    data: dataByRepo,
    isLoading: isDataLoading,
    isFetching: isDataFetching,
  } = useFetchRepositoryByIdQuery(currentRepository?.id, {
    skip: !currentRepository?.id,
    refetchOnMountOrArgChange: true,
  });

  function changeRepository(repo: RepositoryType) {
    setCurrentRepository(repo);
  }

  function updateRepositoryAlertById(id: string) {
    setCurrentRepository((repo) => {
      return { ...repo, hasAlerts: false };
    });
    setRepositories((prevRepos) => {
      return prevRepos.map((repo) => {
        const newRepo = { ...repo };
        if (newRepo.id === id) {
          newRepo.hasAlerts = false;
        }
        return newRepo;
      });
    });
  }

  useEffect(() => {
    if (!isLoading) {
      if (!repos.length) return;
      setCurrentRepository(repos[0]);
      setRepositories(repos);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isDataLoading && !isDataFetching) {
      if (!dataByRepo) return;
      setPushList(dataByRepo.pushes);
      setTasks(dataByRepo.tasks);
      setJournals(dataByRepo.journals);
      setBookmarks(dataByRepo.bookmarkedJournals);
    }
  }, [isDataLoading, isDataFetching]);

  // useEffect(() => {
  //   axios
  //     .get("/api/journal/repo")
  //     .then((res) => {
  //       console.log("res", res.data);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });

  //   const fetchedData = {
  //     repositories: [
  //       {
  //         name: "repo1",
  //         repoId: "12345",
  //         repositoryInfo: {
  //           description: "A simple task tracker",
  //           languages: ["TypeScript", "React", "Node.js", "MongoDB"],
  //         },
  //         hasAlerts: true,
  //       },
  //       {
  //         name: "repo2",
  //         repoId: "12344",
  //         repositoryInfo: {
  //           description: "An issue tracker",
  //           languages: ["TypeScript", "React", "Node.js", "MongoDB"],
  //         },
  //         hasAlerts: false,
  //       },
  //     ],
  //     pushList: [
  //       {
  //         pushId: "12235",
  //         pushAt: "2021-01-01",
  //         commits: [
  //           {
  //             message: "Fix bug in task component",
  //             date: "2021-01-02",
  //             commit_sha: "0987654321",
  //           },
  //           {
  //             message: "Refactor code for better performance",
  //             date: "2021-01-03",
  //             commit_sha: "5678901234",
  //           },
  //         ],
  //       },
  //       {
  //         pushId: "12345",
  //         pushAt: "2021-02-01",
  //         commits: [
  //           {
  //             message: "Fix bug in task component",
  //             date: "2021-01-02",
  //             commit_sha: "0987654321",
  //           },
  //           {
  //             message: "Refactor code for better performance",
  //             date: "2021-01-03",
  //             commit_sha: "5678901234",
  //           },
  //         ],
  //       },
  //     ],
  //     bookmarks: [
  //       {
  //         title: "React",
  //         content:
  //           "This is about React. React is a JavaScript library for building user interfaces.",
  //         commits: [
  //           {
  //             message: "Add a new feature",
  //             date: "2021-01-01",
  //             commit_sha: "1234567890",
  //           },
  //         ],
  //         tasks: [
  //           {
  //             name: "Task 1",
  //             checklist: [
  //               {
  //                 checklistId: "12345",
  //                 description: "check 1",
  //                 checked: false,
  //               },
  //               {
  //                 checklistId: "12346",
  //                 description: "check 2",
  //                 checked: true,
  //               },
  //             ],
  //             progress: "Open",
  //             difficulty: "easy",
  //             taskId: "12347",
  //           },
  //         ],
  //       },
  //     ],
  //     journals: [
  //       {
  //         title: "React",
  //         content:
  //           "This is about React. React is a JavaScript library for building user interfaces.",
  //         commits: [
  //           {
  //             message: "Add a new feature",
  //             date: "2021-01-01",
  //             commit_sha: "1234567890",
  //           },
  //         ],
  //         tasks: [
  //           {
  //             name: "Task 1",
  //             checklist: [
  //               {
  //                 checklistId: "12345",
  //                 description: "check 1",
  //                 checked: false,
  //               },
  //               {
  //                 checklistId: "12346",
  //                 description: "check 2",
  //                 checked: true,
  //               },
  //             ],
  //             progress: "Open",
  //             difficulty: "easy",
  //             taskId: "12347",
  //           },
  //         ],
  //       },
  //     ],
  //     tasks: [
  //       {
  //         name: "Task 1",
  //         checklist: [
  //           {
  //             checklistId: "12345",
  //             description: "check 1",
  //             checked: false,
  //           },
  //           {
  //             checklistId: "12346",
  //             description: "check 2",
  //             checked: true,
  //           },
  //         ],
  //         progress: "Open",
  //         difficulty: "easy",
  //         taskId: "12347",
  //       },
  //       {
  //         name: "Task 2",
  //         checklist: [
  //           {
  //             checklistId: "12348",
  //             description: "check 1",
  //             checked: true,
  //           },
  //           {
  //             checklistId: "12349",
  //             description: "check 2",
  //             checked: true,
  //           },
  //         ],
  //         progress: "In-Progress",
  //         difficulty: "medium",
  //         taskId: "12348",
  //       },
  //       {
  //         name: "Task 3",
  //         checklist: [
  //           {
  //             checklistId: "12350",
  //             description: "check 1",
  //             checked: false,
  //           },
  //           {
  //             checklistId: "12351",
  //             description: "check 2",
  //             checked: false,
  //           },
  //         ],
  //         progress: "Done",
  //         difficulty: "hard",
  //         taskId: "12349",
  //       },
  //     ],
  //   };
  //   if (!fetchedData.repositories.length) return;
  //   setCurrentRepository(fetchedData.repositories[0]);
  //   setInitialState(fetchedData);
  // }, []);

  // useEffect(() => {
  //   if (!currentRepository) return;

  //   if (currentRepository.repoId === "12345") {
  //     setRepositories(initialState.repositories);
  //     setBookmarks(initialState.bookmarks);
  //     setJournals(initialState.journals);
  //     setPushList(initialState.pushList);
  //     setTasks(initialState.tasks);
  //     return;
  //   }

  //   if (currentRepository) {
  //     setBookmarks([]);
  //     setPushList([]);
  //     setJournals([]);
  //     setTasks([]);
  //   }
  // }, [currentRepository]);
  const allLoading = isLoading || isDataLoading || isDataFetching;
  const value: RepositoryContextType = useMemo(
    () => ({
      pushList,
      setPushList,
      currentRepository,
      changeRepository,
      updateRepositoryAlertById,
      repositories,
      bookmarks,
      setBookmarks,
      journals,
      setJournals,
      tasks,
      setTasks,
      allLoading,
    }),
    [repositories, bookmarks, journals, tasks, currentRepository, pushList],
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
