"use client";

import Script from "next/script";
import {useState} from "react";

interface Task {
  name: string;
  location: string;
  text: string;
  answerVariants: AnswerVariant[];
  hints: Hint[];
}

interface AnswerVariant {
  text: string;
  isCorrect: boolean;
}

interface Hint {
  text: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function send() {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].answerVariants.filter(av => av.isCorrect).length === 0) {
        alert(`В задании ${i + 1} не указан правильный ответ`);
        return;
      }
    }

    console.log(JSON.stringify({name, welcomeMessage, tasks}));

    if (!window.Telegram) {
      alert("Telegram API is not available");
      return;
    }

    window.Telegram.WebApp.sendData(JSON.stringify({name, welcomeMessage, tasks}));
  }

  return (
    <div className="p-5">
      <Script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="https://telegram.org/js/telegram-web-app.js"
      />
      <form className="max-w-2xl mx-auto" onSubmit={(e) => {
        e.preventDefault();
        send();
      }}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Название
            маршрута</label>
          <input type="text" id="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Название маршрута" required/>
        </div>

        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Приветственное
            сообщение</label>
          <textarea id="welcomeMessage" rows={5}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Приветственное сообщение" required/>
        </div>

        {tasks.map((task, index) => (
          <Task key={index} number={index + 1} task={task}
                updateTask={(task) => {
                  const newTasks = [...tasks];
                  newTasks[index] = task;
                  setTasks(newTasks);
                }}
                deleteTask={() => setTasks(tasks.filter((_, i) => i !== index))}
          />
        ))}

        <div className="mb-5">
          <button type="button"
                  onClick={() => setTasks([...tasks, {name: "", location: "", text: "", answerVariants: [], hints: []}])}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+
            Добавить задание
          </button>
        </div>

        <div>
          <button type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

function Task(props: { number: number, task: Task, updateTask: (task: Task) => void, deleteTask: () => void }) {
  return (
    <div className="mb-5 border rounded-lg border-white w-full p-3">
      <div className="mb-5 flex gap-2 items-center">
        <h1>Задание {props.number}</h1>
        <button type="button" onClick={props.deleteTask}
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 leading-none">X
        </button>
      </div>

      <div className="mb-5">
        <label htmlFor={`task-name-${props.number}`}
               className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Название</label>
        <input type="text" id={`task-name-${props.number}`}
               value={props.task.name}
               onChange={(e) => props.updateTask({...props.task, name: e.target.value})}
               className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Название" required/>
      </div>

      <div className="mb-5">
        <label htmlFor={`task-location-${props.number}`}
               className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Описание локации</label>
        <textarea id={`task-location-${props.number}`} rows={5}
                  value={props.task.text}
                  onChange={(e) => props.updateTask({...props.task, text: e.target.value})}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Описание локации" required/>
      </div>

      <div className="mb-5">
        <label htmlFor={`task-text-${props.number}`}
               className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Вопрос</label>
        <textarea id={`task-text-${props.number}`} rows={5}
                  value={props.task.location}
                  onChange={(e) => props.updateTask({...props.task, location: e.target.value})}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Вопрос" required/>
      </div>

      {props.task.answerVariants.map((answerVariant, index) => (
        <div key={index} className="mb-5">
          <label htmlFor={`task-answer-${props.number}-${index}`}
                 className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Вариант
            ответа {index + 1}</label>
          <div className="flex flex-row gap-3 items-center">
            <input type="text" id={`task-answer-${props.number}-${index}`}
                   value={answerVariant.text}
                   onChange={(e) => {
                     const newAnswerVariants = [...props.task.answerVariants];
                     newAnswerVariants[index] = {...answerVariant, text: e.target.value};
                     props.updateTask({...props.task, answerVariants: newAnswerVariants});
                   }}
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="Вариант ответа" required/>
            <input type="checkbox" id={`task-answer-${props.number}-${index}-correct`}
                   title={answerVariant.isCorrect ? "Правильный ответ" : "Неправильный ответ"}
                   checked={answerVariant.isCorrect}
                   onChange={(e) => {
                     const newAnswerVariants = [...props.task.answerVariants];
                     newAnswerVariants[index] = {...answerVariant, isCorrect: e.target.checked};
                     props.updateTask({...props.task, answerVariants: newAnswerVariants});
                   }}
                   className="h-5 w-5"/>
            <button type="button" onClick={() => props.updateTask({
              ...props.task,
              answerVariants: props.task.answerVariants.filter((_, i) => i !== index)
            })}
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 leading-none">X
            </button>
          </div>
        </div>
      ))}

      <div className="mb-5">
        <button type="button" onClick={() => props.updateTask({
          ...props.task,
          answerVariants: [...props.task.answerVariants, {text: "", isCorrect: false}]
        })}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+
          Добавить вариант ответа
        </button>
      </div>

      {props.task.hints.map((hint, index) => (
        <div key={index} className="mb-5">
          <label htmlFor={`task-hint-${props.number}-${index}`}
                 className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Подсказка {index + 1}</label>
          <div className="flex flex-row gap-3 items-center">
            <input type="text" id={`task-hint-${props.number}-${index}`}
                   value={hint.text}
                   onChange={(e) => {
                     const newHints = [...props.task.hints];
                     newHints[index] = {...hint, text: e.target.value};
                     props.updateTask({...props.task, hints: newHints});
                   }}
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="Подсказка" required/>
            <button type="button" onClick={() => props.updateTask({
              ...props.task,
              hints: props.task.hints.filter((_, i) => i !== index)
            })}
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 leading-none">X
            </button>
          </div>
        </div>
      ))}

      <div className="mb-5">
        <button type="button" onClick={() => props.updateTask({
          ...props.task,
          hints: [...props.task.hints, {text: ""}]
        })}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+
          Добавить подсказку
        </button>
      </div>
    </div>
  );
}