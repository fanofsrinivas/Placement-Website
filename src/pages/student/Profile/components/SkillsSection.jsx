import React from 'react'
import styles from './SkillsSection.module.css'

const skills = [
  { name: 'JavaScript / TypeScript', level: 'Advanced' },
  { name: 'React & Node.js', level: 'Advanced' },
  { name: 'Data Structures & Algorithms', level: 'Intermediate' },
  { name: 'SQL / MongoDB', level: 'Intermediate' },
]

const SkillsSection = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Skills</h2>
      </header>
      <ul className={styles.list}>
        {skills.map((skill) => (
          <li key={skill.name} className={styles.item}>
            <span className={styles.name}>{skill.name}</span>
            <span className={styles.level}>{skill.level}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SkillsSection

