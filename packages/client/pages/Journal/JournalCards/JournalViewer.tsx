import React, { useState } from "react";
import dayjs from "dayjs";
import { H1 } from "@client/components/headings";
import { JournalType } from "@client/types";
import Markdown from "react-markdown";
import Modal from "@client/components/layout/Modal";
import remarkGfm from "remark-gfm";
import RotatedCross from "@client/components/svgs/RotatedCross";

type Props = {
  journal: JournalType;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

function JournalViewer({ journal, openModal, setOpenModal }: Props) {
  return (
    <Modal isOpen={openModal}>
      <div className="flex flex-col justify-center gap-y-2 w-[40%] h-[85%] text-paragraph text-left">
        <div className="flex items-center relative min-w-full w-full">
          <button
            className="absolute -left-6"
            onClick={() => setOpenModal(false)}
          >
            <RotatedCross
              area={{
                width: 15,
                height: 15,
              }}
              black
            />
          </button>
          <H1 classname="font-black text-primary-yellow text-left">
            {journal?.title || "Untitled"}
          </H1>
        </div>
        <p className="italic text-xs py-2">
          Published date: {dayjs(journal?.created_at).format("MMMM DD, YYYY")}
        </p>
        <div className="overflow-auto min-h-[95%] pr-4 text-lg min-w-full w-full">
          <Markdown
            className="prose lg:prose-lg prose-headings:text-paragraph prose-p: text-paragraph prose-strong:text-blue-300 min-w-full"
            remarkPlugins={[remarkGfm]}
          >
            {journal?.content}
          </Markdown>
        </div>
      </div>
    </Modal>
  );
}

export default JournalViewer;
