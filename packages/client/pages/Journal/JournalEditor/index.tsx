import { CommitType, JournalType, TaskType } from "@client/types";
import React, { useEffect, useRef, useState } from "react";
import CommitDropdown from "./CommitDropdown";
import Paper from "@client/components/layout/Paper";
import TaskDropdown from "./TaskDropdown";
import { useAddJournalMutation } from "@client/store";
import { useRepository } from "@client/contexts/RepositoryContext";

function JournalEditor() {
  const [title, setTitle] = useState("");
  const [commits, setCommits] = useState<CommitType[]>([]); // ["commit1", "commit2"
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]); // ["commit1", "commit2"

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
      title,
      content,
      commits,
      tasks: selectedTasks,
      status: "draft",
    };

    addJournal({
      journal: newJournal,
      rest: {
        repoId: currentRepository?.id,
      },
    });
    setJournals([newJournal, ...journals]);
    setTitle("");
    setContent("");
    setCommits([]);
    setSelectedTasks([]);
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

  return (
    <Paper classname="flex flex-col gap-y-8 text-primary-black">
      <div className="flex flex-col gap-y-2">
        <input
          className="focus:outline-none rounded-md bg-primary-black text-heading-1 leading-heading-1 placeholder:text-heading-1 font-extrabold text-primary-yellow placeholder:text-primary-yellow focus:placeholder:opacity-0"
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
        <CommitDropdown commits={commits} onSave={handleCommitSave} />
        <TaskDropdown onSave={handleTaskSave} selectedTasks={selectedTasks} />
        <button className="bg-primary-yellow text-primary-black focus:outline-none px-3 py-1.5 rounded-smd text-sm font-extrabold hover:border hover:border-primary-yellow hover:text-primary-yellow hover:bg-transparent border border-transparent">
          Save Draft
        </button>
        <button
          className="bg-primary-yellow text-primary-black focus:outline-none px-3 py-1.5 rounded-smd text-sm font-extrabold hover:border hover:border-primary-yellow hover:text-primary-yellow hover:bg-transparent border border-transparent"
          onClick={handleJournalSubmission}
        >
          Save
        </button>
      </div>
    </Paper>
  );
}

export default JournalEditor;
