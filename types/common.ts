export interface CommonResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface ApiError {
  response?: {
    _data: {
      message: string;
    };
  } | null;
  data?: {
    message: string;
  } | null;
  status?: number;
  message?: string;
}

export interface FetchError {
  name: string;
  message: string;
  stack?: string;
  status?: number;
  statusText?: string;
  response?: {
    status: number;
    statusText: string;
    _data?: {
      message?: string;
      code?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export interface ApiResponse<T> {
  error: ApiError;
  data: CommonResponse<T> | null;
}

export interface BasicInputValue {
  inputName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputValue: any;
  label: string;
  inputClass?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  regex?: RegExp;
  validationMessage?: string;
  type?: string;
  inputType: string;
}

export interface Paging {
  totalCount: number;
  totalPageCount: number;
  pageNo: number;
  pageSize: number;
}

export interface SelectItem {
  title: string;
  value: string;
  type?: string;
  subSelectList?: SelectItem[];
}
