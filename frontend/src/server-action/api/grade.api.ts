import { createApiConfig } from "../config/Api-config";
import {
  Grade,
  Section,
  CreateGradePayload,
  UpdateGradePayload,
} from "@/app/dashboard/types/grade";
import { DB } from "../../constant/constant";

const gradeApi = createApiConfig<
  Grade,
  CreateGradePayload,
  UpdateGradePayload
>(DB.GRADE, "Grade");


// Grade API
export const useGetAllGrades = gradeApi.useGetAll;
export const useGetGradeById = gradeApi.useGetById;
export const useCreateGrade = gradeApi.useCreate;
export const useUpdateGrade = gradeApi.useFullUpdate;
// export const usePatchGrade = gradeApi.useUpdate;
export const useDeleteGrade = gradeApi.useDelete;
 