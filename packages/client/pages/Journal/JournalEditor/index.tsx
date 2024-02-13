import { CommitType, JournalType, TaskType } from "@client/types";
import React, { useEffect, useRef, useState } from "react";
import API from "@client/api";
import CommitDropdown from "./CommitDropdown";
import JournalViewer from "../JournalCards/JournalViewer";
import Paper from "@client/components/layout/Paper";
import TaskDropdown from "./TaskDropdown";
import { useAddJournalMutation } from "@client/store";
import { useRepository } from "@client/contexts/RepositoryContext";

function JournalEditor() {
  const [title, setTitle] = useState("");
  const [commits, setCommits] = useState<CommitType[]>([]); // ["commit1", "commit2"
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]); // ["commit1", "commit2"
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  const { journals, setJournals, currentRepository } = useRepository();
  const [
    addJournal,
    { data: journalData, isLoading: journalLoading, error: journalError },
  ] = useAddJournalMutation();

  useEffect(() => {
    setCommits([]);
    setSelectedTasks([]);
  }, [currentRepository]);

  function handleJournalSubmission() {
    const newJournal: JournalType = {
      title: title || "Untitled",
      content,
      commits,
      tasks: selectedTasks,
      status: "published",
      is_bookmarked: false,
    };
    setLoading(true);

    API.post(
      "/api/journal/journals",
      {
        journal: newJournal,
        rest: {
          repoId: currentRepository?.id,
        },
      },
      {
        withCredentials: true,
      },
    )
      .then((res) => {
        console.log("res", res);
        const { id } = res.data;
        const modJournal = { ...newJournal, id };
        setJournals([modJournal, ...journals]);
        setTitle("");
        setContent("");
        setCommits([]);
        setSelectedTasks([]);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCommitSave(stagedCommits: CommitType[]) {
    setCommits(stagedCommits);
  }

  function handleTaskSave(stagedTasks: TaskType[]) {
    setSelectedTasks(stagedTasks);
  }

  function handleTextChange(event: any) {
    setContent(event.target.value);
    resetTextAreaHeight();
  }

  function resetTextAreaHeight() {
    const textArea = contentRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  const mockJournal: JournalType = {
    title,
    content,
    commits: [],
    tasks: [],
    status: "draft",
    is_bookmarked: false,
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <JournalViewer
        journal={mockJournal}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <Paper classname="flex flex-col gap-y-8 text-primary-black">
        <div className="flex flex-col gap-y-2">
          <input
            className="focus:outline-none rounded-md bg-primary-black text-heading-2 leading-heading-2 placeholder:text-heading-2 font-extrabold text-primary-yellow placeholder:text-primary-yellow focus:placeholder:opacity-0"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            value={title}
          />
          <textarea
            className="focus:outline-none rounded-md bg-primary-black text-heading-4 leading-heading-4 placeholder:text-heading-4 text-paragraph placeholder:text-paragraph focus:placeholder:opacity-0"
            onChange={handleTextChange}
            placeholder="Type something..."
            ref={contentRef}
            style={{ height: "auto", overflow: "hidden" }}
            value={content}
          />
        </div>
        <div className="flex gap-x-2">
          <button
            className="border border-black-5 text-paragraph px-3 py-1.5 rounded-smd font-extrabold text-sm focus:outline-none hover:bg-paragraph hover:border-transparent hover:text-black"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Preview
          </button>
          <CommitDropdown commits={commits} onSave={handleCommitSave} />
          <TaskDropdown onSave={handleTaskSave} selectedTasks={selectedTasks} />
          <button
            className="bg-primary-yellow text-primary-black focus:outline-none px-3 py-1.5 rounded-smd text-sm font-extrabold hover:border hover:border-primary-yellow hover:text-primary-yellow hover:bg-transparent border border-transparent"
            onClick={handleJournalSubmission}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </Paper>
    </>
  );
}

export default JournalEditor;
