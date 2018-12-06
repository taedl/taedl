import { ErrorDialogComponent } from './error-dialog.component';

export const errorHandler = (dialog, errorMessage?, acceptMessage?, decline?) => {
  const message = errorMessage ? errorMessage : 'Could not connect to the server.';
  const accept = acceptMessage ? acceptMessage : 'OK';
  const dialogRef = dialog.open(ErrorDialogComponent, {
    data: {
      message,
      accept,
      decline
    }
  });
  return dialogRef.afterClosed();
};
