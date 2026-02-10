
export enum InstitutionType {
  PONPES = 'PONPES',
  TPQ = 'TPQ',
  MDT = 'MDT',
  RTQ = 'RTQ',
  PAUDQU = 'PAUDQU'
}

export interface YearData {
  [year: string]: number;
}

export interface BaseInstitution {
  id: string;
  type: InstitutionType;
  basic: {
    name: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  legality: {
    leader: string;
    licenseNumber: string;
    foundation: string;
    legalityDetails: string;
    socialMedia: string;
    gmapsUrl: string;
  };
  stats: {
    yearFounded: string;
    totalStudents: number;
    totalTeachers: number;
  };
  financialAid: {
    bos: YearData;
    incentive: YearData;
    pip?: YearData; // Specific to Ponpes
    inkubasi?: YearData; // Specific to Ponpes
    bop?: YearData; // Specific to Ponpes
    other: YearData;
  };
  extracurriculars: {
    sports: string;
    arts: string;
    others?: string;
  };
  visionMisi: {
    vision: string;
    mision: string;
    program: string;
    yearlyProgram?: string;
    calendar?: string;
  };
  documentation: {
    googleDriveLink: string;
  };
  facilities: string[];
  achievements: {
    education: string;
    sports: string;
    arts: string;
  };
}

export interface EducationLevelDetail {
  type: 'pkpps' | 'madrasah' | 'diknas' | '';
  students: {
    male: number;
    female: number;
  };
  personnel: {
    teachers: number;
    staff: number;
  };
  bpjs: {
    teacherHealth: number;
    teacherWork: number;
    staffHealth: number;
    staffWork: number;
  };
  unParticipants: YearData;
  unGraduates: YearData;
}

export interface PonpesInstitution extends BaseInstitution {
  type: InstitutionType.PONPES;
  levels: {
    ula: EducationLevelDetail;
    wustha: EducationLevelDetail;
    ulya: EducationLevelDetail;
  };
  universityAcceptance: YearData;
  universityNames: string;
  kitabKuning: string;
  buildingFloors: {
    office: number;
    mosque: number;
    dormMale: number;
    dormFemale: number;
    classroom: number;
    library: number;
    hall: number;
    kitchen: number;
  };
}

export interface NonPonpesInstitution extends BaseInstitution {
  type: InstitutionType.TPQ | InstitutionType.MDT | InstitutionType.RTQ | InstitutionType.PAUDQU;
  studentEducationLevels: {
    maleSd: number;
    femaleSd: number;
    maleSmp: number;
    femaleSmp: number;
    maleSma: number;
    femaleSma: number;
    teachers: number;
    staff: number;
  };
  munaqasyahParticipants: YearData;
  munaqasyahGraduates: YearData;
  bpjs: {
    teacherHealth: number;
    teacherWork: number;
    staffHealth: number;
    staffWork: number;
  };
  subjects: string;
  learningBooks: string;
  media: string;
}

export type Institution = PonpesInstitution | NonPonpesInstitution;
