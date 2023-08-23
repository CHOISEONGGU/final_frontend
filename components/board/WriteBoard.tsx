import React, { useState, useEffect } from "react";
import "./../../public/css/board.css";
import Board from "../../types/board";

interface WriteBoardProps {
  board: Board;
  formClass: string;
  FormTitle: string;
  handleXButton: () => void;
  BoardComplete: (board: Board) => void;
}

export default function WriteBoard(props: WriteBoardProps) {
  const [newBoard, setNewBoard] = useState<Board>({ ...props.board });

  useEffect(() => {
    setNewBoard({ ...props.board });
  }, [props.board]);

  return (

    <div className="max-w-2xl justify-center items-center z-5000" style={{position:'absolute', width: '100%' }} >
      <div className={props.formClass}>
        <div className={"max-w-xl bg-white p-6 shadow-lg rounded-md border"}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold ml-3 mt-4 ">{props.FormTitle}</div>
          <div
            className="cursor-pointer text-red-500"
            onClick={props.handleXButton}>
            X
          </div>
        </div>
        <form>
          <div className="mb-4 mr-4 ml-3 py-2">
            <input
              placeholder="제목"
              type="text"
              value={newBoard.btitle}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewBoard({ ...newBoard, btitle: event.target.value })
              }
              className="w-full px-5 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-4 mr-4 ml-3 py-2">
            <textarea
              placeholder="내용"
              rows={4}
              value={newBoard.bcontent}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewBoard({ ...newBoard, bcontent: event.target.value })
              }
              className="w-full px-5 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            ></textarea>
          </div>
        </form>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => props.BoardComplete(newBoard)}
            className="bg-pink-500 hover:bg-black text-white px-4 py-2 rounded focus:outline-none"
          >
            게시글 작성 완료
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}