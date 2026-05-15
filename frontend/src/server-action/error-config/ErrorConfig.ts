import axios from "axios";

// Types
interface ErrorConfigParams {
    error: unknown;
    entryNameFormatted: string;
}

// Extract readable error message from any error type
const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "An unexpected error occurred";
};

// GET error config
export const GetErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Failed to load ${entryNameFormatted}`;

    if (errorText.includes("not found")) {
        errorMessage = `${entryNameFormatted} not found.`;
    } else if (errorText.includes("Unauthorized")) {
        errorMessage = "You are not authorized to view this data.";
    } else if (errorText.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
    }

    return errorMessage;
};

// POST error config
export const PostErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Error creating ${entryNameFormatted}`;

    if (errorText.includes("User already exists")) {
        errorMessage = "This email is already registered. Please use another.";
    } else if (errorText.includes("Duplicate entry")) {
        errorMessage = `This ${entryNameFormatted} already exists. Please use another.`;
    } else if (errorText.includes("validation")) {
        errorMessage = "Please check the entered data.";
    }

    return errorMessage;
};

// PUT error config
export const PutErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Error updating ${entryNameFormatted}`;

    if (errorText.includes("not found")) {
        errorMessage = `${entryNameFormatted} not found.`;
    } else if (errorText.includes("Duplicate entry")) {
        errorMessage = `Another ${entryNameFormatted} with the same data already exists.`;
    }

    return errorMessage;
};

// PATCH error config
export const PatchErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Error updating ${entryNameFormatted}`;

    if (errorText.includes("invalid")) {
        errorMessage = "Invalid update data provided.";
    } else if (errorText.includes("not found")) {
        errorMessage = `${entryNameFormatted} not found.`;
    }

    return errorMessage;
};

// DELETE error config
export const DeleteErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Error deleting ${entryNameFormatted}`;

    if (errorText.includes("in use")) {
        errorMessage = `Cannot delete ${entryNameFormatted} because it is currently in use.`;
    } else if (errorText.includes("not found")) {
        errorMessage = `${entryNameFormatted} not found.`;
    }

    return errorMessage;
};

// BULK DELETE error config
export const BulkDeleteErrorConfig = ({
    error,
    entryNameFormatted,
}: ErrorConfigParams): string => {
    const errorText = extractErrorMessage(error);

    let errorMessage = `Error deleting ${entryNameFormatted}`;

    if (errorText.includes("partial")) {
        errorMessage = `Some ${entryNameFormatted} could not be deleted.`;
    } else if (errorText.includes("not found")) {
        errorMessage = `Some ${entryNameFormatted} were not found.`;
    }

    return errorMessage;
};

// Common fallback error config
export const CommonErrorConfig = ({
    error,
}: {
    error: unknown;
}): string => {
    return extractErrorMessage(error);
};
