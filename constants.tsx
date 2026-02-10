
import React from 'react';
import { InstitutionType } from './types';

export const INSTITUTION_METADATA = {
  [InstitutionType.PONPES]: {
    label: 'Pondok Pesantren',
    color: 'emerald',
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  [InstitutionType.TPQ]: {
    label: 'TPQ / TPA',
    color: 'sky',
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  [InstitutionType.MDT]: {
    label: 'Madrasah Diniyah (MDT)',
    color: 'indigo',
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  [InstitutionType.RTQ]: {
    label: 'Rumah Tahfidz (RTQ)',
    color: 'amber',
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  [InstitutionType.PAUDQU]: {
    label: 'PAUDQU',
    color: 'rose',
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export const MOCK_DATA = [
  {
    id: '1',
    type: InstitutionType.PONPES,
    basic: {
      name: 'Pondok Pesantren Sultan Hasanuddin',
      tagline: 'Mencetak Generasi Qurani yang Berintelektual',
      description: 'Pesantren modern tertua di Gowa dengan fokus pada Tahfidz dan Sains.',
      address: 'Jl. Poros Limbung No. 22, Gowa',
      phone: '08123456789',
      email: 'sultan@ponpes.id',
      website: 'www.sultanhsn.id'
    },
    legality: {
      leader: 'KH. Dr. Ahmad Mansur',
      licenseNumber: 'PONTREN/GW/2023/001',
      foundation: 'Yayasan Pendidikan Sultan Hasanuddin',
      legalityDetails: 'SK Menkumham No. AHU-001234.2020',
      socialMedia: '@sultanhsn_gowa',
      gmapsUrl: 'https://maps.google.com/?q=Gowa'
    },
    stats: {
      yearFounded: '1995',
      totalStudents: 1250,
      totalTeachers: 85
    },
    financialAid: {
      bos: { '2021': 50000000, '2022': 55000000, '2023': 60000000, '2024': 65000000, '2025': 70000000 },
      incentive: { '2021': 10000000, '2022': 12000000, '2023': 15000000, '2024': 18000000, '2025': 20000000 },
      other: { '2021': 5000000, '2022': 5000000, '2023': 7000000, '2024': 10000000, '2025': 12000000 },
    },
    facilities: ['Asrama AC', 'Laboratorium Bahasa', 'Gedung Serbaguna'],
    achievements: {
      education: 'Juara 1 MQK Tingkat Provinsi 2023',
      sports: 'Juara 2 Pencak Silat Nasional',
      arts: 'Juara Harapan Kaligrafi'
    },
    visionMisi: {
      vision: 'Menjadi pusat keunggulan pendidikan Islam di Sulawesi Selatan.',
      mision: 'Menyelenggarakan pendidikan formal dan informal berbasis pesantren.',
      program: 'Tahfidz 30 Juz, Penguasaan Kitab Kuning'
    },
    documentation: {
      googleDriveLink: 'https://drive.google.com/...'
    }
  }
];
