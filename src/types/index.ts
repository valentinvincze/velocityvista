import { Dispatch, ReactNode, SetStateAction } from "react";

export type SignUpFormProps = {
  options: Option[];
};

export type Option = {
  name: string;
  id: string;
};

export interface ISignUpForm {
  fullName: string;
  jobTitle: string;
  emailAddress: string;
  password: string;
  role: string;
  division: string;
}

export interface ISignInForm {
  emailAddress: string;
  password: string;
}

export interface ILogSale {
  id?: number;
  amount: number;
  title: string;
  status: string;
  closing_date: string;
}

export interface ICreateDivision {
  div_name: string;
}

export interface ISendToken {
  emailAddress: string;
}

export type AuthState = {
  success: boolean;
  error: string;
} | null;

export type NavLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  icon?: ReactNode;
};

export type SignOutBtnProps = {
  icon: ReactNode;
};

export type NavbarProps = {
  avatar: ReactNode;
  name: string;
  jobtitle: string;
  role: string;
};

export type ModalProps = {
  trigger: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

export type StatCardProps = {
  title: string;
  icon: ReactNode;
  saleCount: number;
  rateStyle: { icon: ReactNode; style: string };
  currentRate: number;
  lastRate: number;
  overallRate: number;
  when: string;
};

export type LChartProps = {
  label: string;
  currentDayCount: number;
  lastDayCount: number;
}[];

export type PanelControlProps = {
  role: string;
  divisions: Divisions;
  profiles: ProfileData;
  divProfiles: ProfileData;
};

export type PanelTableProps = {
  profiles: ProfileData;
  divProfiles: ProfileData;
  userRole: string;
  start: number;
  end: number;
  currentPageNum: number;
  setCurrentPageNum: Dispatch<SetStateAction<number>>;
  totalPageNumP: number;
  totalPageNumDP: number;
  totalUserCountP: number;
  totalUserCountDP: number;
};

export type userData =
  | {
      full_name: string;
      job_title: string;
    }
  | undefined;

export type Sales = ILogSale[] | null;

export type ProfileData =
  | {
      id: string;
      full_name: string;
      email: string;
      role: "coo" | "admin" | "rep";
      created_at: string;
      division_id: string | null;
    }[]
  | null;

type Divisions =
  | {
      id: string;
      name: string;
    }[]
  | null;
