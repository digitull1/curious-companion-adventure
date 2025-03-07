
// This file contains the toast hook implementation
import { useEffect, useState } from 'react';
import { toast as sonnerToast, Toast, ToastOptions } from 'sonner';

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export type ToasterToast = ToastProps;

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

type State = {
  toasts: ToasterToast[];
};

export const toastState: State = {
  toasts: [],
};

let listeners: ((state: State) => void)[] = [];

const emit = () => {
  listeners.forEach((listener) => {
    listener(toastState);
  });
};

export function toast({
  title,
  description,
  variant,
  ...props
}: ToasterToast) {
  const id = crypto.randomUUID();

  const update = (props: ToasterToast) =>
    dispatch({
      ...props,
      id,
    });

  const dismiss = () => remove(id);

  const newToast: ToasterToast = {
    id,
    title,
    description,
    variant,
    ...props,
  };

  dispatch(newToast);

  // Also send to sonner toast
  const options: ToastOptions = { id };
  
  if (variant === 'destructive') {
    sonnerToast.error(title, {
      description,
      ...options,
    });
  } else {
    sonnerToast(title, {
      description,
      ...options,
    });
  }

  return {
    id,
    dismiss,
    update,
  };
}

function dispatch(toast: ToasterToast) {
  const { toasts } = toastState;

  if (toasts.length >= TOAST_LIMIT) {
    toasts.shift();
  }

  toastState.toasts = [toast, ...toasts];
  emit();
}

function remove(id: string) {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
  emit();
}

export function useToast() {
  const [state, setState] = useState<State>(toastState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((listener) => listener !== setState);
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => remove(toastId),
  };
}
