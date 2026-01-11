import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);


const employees = [
  {
    full_name: 'Jean Dupont',
    email: 'jean.dupont@company.com',
    phone_number: '+237 6 12 34 56 78',
    date_of_birth: '1990-05-15',
    photo_path: null,
    job_title: 'Développeur Full Stack',
    department: 'IT',
    salary: 75000.00,
    start_date: '2020-01-15',
    end_date: null
  },
  {
    full_name: 'Marie Kouame',
    email: 'marie.kouame@company.com',
    phone_number: '+237 6 98 76 54 32',
    date_of_birth: '1988-08-22',
    photo_path: null,
    job_title: 'Chef de Projet',
    department: 'Management',
    salary: 85000.00,
    start_date: '2019-03-01',
    end_date: null
  },
  {
    full_name: 'Paul Mbarga',
    email: 'paul.mbarga@company.com',
    phone_number: '+237 6 55 44 33 22',
    date_of_birth: '1995-12-10',
    photo_path: null,
    job_title: 'Designer UI/UX',
    department: 'Design',
    salary: 65000.00,
    start_date: '2021-06-20',
    end_date: null
  },
  {
    full_name: 'Sophie Nkomo',
    email: 'sophie.nkomo@company.com',
    phone_number: '+237 6 11 22 33 44',
    date_of_birth: '1992-03-30',
    photo_path: null,
    job_title: 'Responsable RH',
    department: 'Human Resources',
    salary: 70000.00,
    start_date: '2018-09-15',
    end_date: null
  },
  {
    full_name: 'David Tankou',
    email: 'david.tankou@company.com',
    phone_number: '+237 6 77 88 99 00',
    date_of_birth: '1985-07-18',
    photo_path: null,
    job_title: 'Directeur Technique',
    department: 'IT',
    salary: 95000.00,
    start_date: '2017-02-01',
    end_date: null
  },
  {
    full_name: 'Amina Fofana',
    email: 'amina.fofana@company.com',
    phone_number: '+237 6 44 55 66 77',
    date_of_birth: '1993-11-05',
    photo_path: null,
    job_title: 'Développeuse Backend',
    department: 'IT',
    salary: 72000.00,
    start_date: '2020-08-10',
    end_date: null
  },
  {
    full_name: 'Eric Biya',
    email: 'eric.biya@company.com',
    phone_number: '+237 6 88 99 00 11',
    date_of_birth: '1991-01-25',
    photo_path: null,
    job_title: 'Comptable',
    department: 'Finance',
    salary: 60000.00,
    start_date: '2019-11-01',
    end_date: null
  },
  {
    full_name: 'Fatima Moussa',
    email: 'fatima.moussa@company.com',
    phone_number: null,
    date_of_birth: '1994-09-12',
    photo_path: null,
    job_title: 'Assistante Marketing',
    department: 'Marketing',
    salary: 55000.00,
    start_date: '2022-01-15',
    end_date: null
  }
];


const timesheets = [
  {
    employee_id: 1,
    start_time: '2026-01-06 08:00:00',
    end_time: '2026-01-06 17:00:00',
    summary: 'Développement de la nouvelle fonctionnalité de reporting'
  },
  {
    employee_id: 1,
    start_time: '2026-01-07 09:00:00',
    end_time: '2026-01-07 18:00:00',
    summary: 'Correction de bugs et tests unitaires'
  },
  {
    employee_id: 1,
    start_time: '2026-01-08 08:30:00',
    end_time: '2026-01-08 17:30:00',
    summary: 'Revue de code et documentation'
  },
  {
    employee_id: 2,
    start_time: '2026-01-06 08:00:00',
    end_time: '2026-01-06 16:00:00',
    summary: 'Réunion de planification du sprint'
  },
  {
    employee_id: 2,
    start_time: '2026-01-07 08:00:00',
    end_time: '2026-01-07 17:00:00',
    summary: 'Coordination avec les équipes et suivi des tâches'
  },
  {
    employee_id: 3,
    start_time: '2026-01-06 09:00:00',
    end_time: '2026-01-06 18:00:00',
    summary: 'Conception des maquettes pour l\'application mobile'
  },
  {
    employee_id: 3,
    start_time: '2026-01-07 10:00:00',
    end_time: '2026-01-07 19:00:00',
    summary: 'Présentation des designs aux stakeholders'
  },
  {
    employee_id: 4,
    start_time: '2026-01-06 08:00:00',
    end_time: '2026-01-06 17:00:00',
    summary: 'Entretiens de recrutement'
  },
  {
    employee_id: 4,
    start_time: '2026-01-07 08:00:00',
    end_time: '2026-01-07 16:30:00',
    summary: 'Formation des nouveaux employés'
  },
  {
    employee_id: 5,
    start_time: '2026-01-08 09:00:00',
    end_time: '2026-01-08 17:00:00',
    summary: 'Architecture de la nouvelle infrastructure cloud'
  },
  {
    employee_id: 6,
    start_time: '2026-01-09 08:00:00',
    end_time: '2026-01-09 18:00:00',
    summary: 'Développement des APIs REST'
  },
  {
    employee_id: 7,
    start_time: '2026-01-06 08:00:00',
    end_time: '2026-01-06 17:00:00',
    summary: 'Clôture comptable mensuelle'
  },
  {
    employee_id: 8,
    start_time: '2026-01-07 08:00:00',
    end_time: '2026-01-07 17:00:00',
    summary: 'Préparation de la campagne publicitaire'
  },
  {
    employee_id: 1,
    start_time: '2026-01-09 08:00:00',
    end_time: '2026-01-09 17:00:00',
    summary: 'Maintenance et optimisation de la base de données'
  },
  {
    employee_id: 2,
    start_time: '2026-01-10 08:00:00',
    end_time: '2026-01-10 12:00:00',
    summary: 'Réunion stratégique trimestrielle'
  }
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});