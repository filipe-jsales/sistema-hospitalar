import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';

interface UseFormCleanupProps {
  dispatch: ReturnType<typeof useAppDispatch>;
  clearError: () => { type: string };
  clearSuccessMessage: () => { type: string };
  resetFormState?: () => void;
  resetFormErrors?: () => void;
}

export const useFormCleanup = ({
  dispatch,
  clearError,
  clearSuccessMessage,
  resetFormState,
  resetFormErrors,
}: UseFormCleanupProps) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      if (resetFormState) resetFormState();
      if (resetFormErrors) resetFormErrors();
    });

    return () => {
      unlisten();
    };
  }, [history, dispatch, resetFormState, resetFormErrors]);
};