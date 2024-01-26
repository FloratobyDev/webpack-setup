import { CommitType, JournalType, TaskType } from "@client/types";
import React, { useEffect, useRef, useState } from "react";
import CommitDropdown from "./CommitDropdown";
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
    <div className="flex flex-col gap-y-8 text-black">
      <div className="flex flex-col gap-y-2">
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        <textarea
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
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Save Draft
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={handleJournalSubmission}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default JournalEditor;
