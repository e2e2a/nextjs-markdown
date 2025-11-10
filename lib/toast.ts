import toast from 'react-hot-toast';

export const makeToastSucess = (text: string) => {
  toast.success(text, {
    style: {
      borderRadius: '0px',
      background: '#fff',
      color: '#333',
    },
    // position: "top-right",
  });
};

export const makeToastError = (text: string) => {
  toast.error(text, {
    style: {
      borderRadius: '0px',
      background: '#fff',
      color: '#333',
    },
    // position: "top-right",
  });
};
