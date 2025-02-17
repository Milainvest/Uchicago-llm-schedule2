import React from "react";
import styles from "../styles/Calendar.module.css"; // CSS Modules をインポート
import { Course } from "../types/course";
import { Weekday } from "../stores/useFilterStore";

// 時間スロットを生成、8時から21時まで
const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = 8 + i;
  return `${hour}:00`;
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


const timeToPosition = (time: string) => {
  if (!time) {
    console.error("Error: time is undefined or null!", time);
    return 0; // `0` を返してクラッシュを防ぐ
  }

  const [hour, minute] = time.split(":").map(Number);
  const timeIndex = (hour - 8) * 60 + minute;
  return timeIndex;
}

export default function Calendar({ selectedCourses }: { selectedCourses: Course[] }) {
  return (
    <div className={styles["calendar-container"]} >
        {/* 曜日ヘッダーを追加 */}
        <div className={styles["days-header"]}>
          <div className={styles["empty-header"]}></div> {/* 左上の空白エリア */}
           {days.map((day) => (
            <div key={day} className={styles["day-header"]}>{day}</div>
         ))}
      </div>
      <div className={styles["calendar-body"]}>
      <div className={styles["time-column"]}>
        {timeSlots.map((time) => (
          <div key={time} className={styles["time-slot"]}>{time}</div>
        ))}
      </div>
      <div className={styles["days-grid"]}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <div key={day} className={styles["day-column"]}>
            {selectedCourses
              .filter((course) => course.days.includes(day as Weekday))
              .map((course) => {
                const top = timeToPosition(course.timeStart) - timeToPosition("08:00");
                const height = timeToPosition(course.timeEnd) - timeToPosition(course.timeStart);
                return (
                  <div
                    key={course.id}
                    className={styles["event"]}
                    style={{
                      top: `${top}px`, // ここでtopをpxに変換
                      height: `${height}px`
                    }}
                  >
                    <p style={{ fontSize: '12px' }}>{course.name}</p>
                    <p style={{ fontSize: '12px' }}>{course.timeStart} - {course.timeEnd}</p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
