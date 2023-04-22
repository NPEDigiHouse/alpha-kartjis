export const createResponse = (
  status: string,
  data: string | object | null = null
) => {
  if (data) {
    return { status, data };
  }

  return { status, message: data };
};

export const constants = {
  SUCCESS_RESPONSE_MESSAGE: "success",
  FAILED_RESPONSE_MESSAGE: "failed",
};
