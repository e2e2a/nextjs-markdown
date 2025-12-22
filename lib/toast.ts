import toast from 'react-hot-toast';
const baseClass = 'rounded-none bg-sidebar! drop-shadow-lg! shadow-lg! text-foreground! ';

export const makeToastSucess = (text: string) => {
  toast.success(text, {
    className: baseClass,
  });
};

export const makeToastError = (text: string) => {
  toast.error(text, {
    className: baseClass,
  });
};
