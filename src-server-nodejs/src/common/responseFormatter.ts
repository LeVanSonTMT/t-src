const successResponse = ({
  res,
  result,
  statusCode,
}: {
  res: any,
  result: any,
  statusCode: number,
}) => {
  res.status(statusCode).json({
    status: statusCode,
    result,
  });
};

const errorResponse = ({
  res,
  error,
  statusCode,
}: {
  res: any,
  error: any,
  statusCode: number,
}) => {
  res.status(statusCode).json({
    error: error,
    status: statusCode,
  });
};

const successFileResponse = ({
  res,
  fileUrl,
  fileName,
  fileType,
  fileBuffer,
}: {
  res: any,
  fileUrl: string,
  fileName: string,
  fileType: string,
  fileBuffer: any,
}) => {
  // Setup header
  res.setHeader("Content-Type", fileType);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURI(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
  );

  res.setHeader("Content-Length", fileBuffer.length);

  // Add status information in header
  res.setHeader("X-Status", 200);
  res.setHeader("X-Message", "success");
  res.setHeader("X-File-Type", fileType);
  res.setHeader("X-File-Url", encodeURI(fileUrl));
  res.setHeader("X-File-Name", encodeURI(fileName));

  res.status(200).end(fileBuffer)
};

const errorFileResponse = ({ res, message, statusCode }: { res: any, message: any, statusCode: any }) => {
  // Returns status in header
  res.setHeader("X-Status", statusCode);

  // Encode the message before setting the header to allow sending Vietnamese
  const encodedMessage = encodeURIComponent(message);

  res.setHeader("X-Message", encodedMessage);

  // Write buffer to response
  res.status(statusCode).send();
};

export {
  errorResponse,
  successResponse,
  errorFileResponse,
  successFileResponse,
};
