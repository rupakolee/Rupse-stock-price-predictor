export const getPhotoUrl = (photoPath?: string) =>
  photoPath ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${photoPath}` : undefined;