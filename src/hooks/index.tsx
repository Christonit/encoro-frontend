import { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { useHistory } from "../context/history";
import { useSession, getSession, getCsrfToken } from "next-auth/react";
import axios, { AxiosResponse, AxiosInstance } from "axios";

type BackendMethods = {
  get: (url: string, data?: any) => Promise<AxiosResponse>;
  post: (url: string, data: any) => Promise<AxiosResponse>;
  patch: (url: string, data: any) => Promise<AxiosResponse>;
  put: (url: string, data?: any) => Promise<AxiosResponse>;
  destroy: (url: string, data?: any) => Promise<AxiosResponse>;
};

declare module "next-auth" {
  interface Session {
    access_token?: string;
  }
}

const useBackend = (): BackendMethods => {
  const { data: session } = useSession();
  const [access_token, setAccessToken] = useState("");

  useEffect(() => {
    if (session?.user && session?.access_token) {
      const { access_token } = session;
      setAccessToken(access_token);
    }
  }, [session]);

  const get = async (url: string, data?: any): Promise<AxiosResponse> => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await axiosInstance.get(url, data);
    return response;
  };

  const post = async (url: string, data: any): Promise<AxiosResponse> => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await axiosInstance!.post(url, data);
    return response;
  };
  const destroy = async (url: string, data?: any): Promise<AxiosResponse> => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await axiosInstance!.post(url, data);
    return response;
  };

  const patch = async (url: string, data: any): Promise<AxiosResponse> => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await axiosInstance!.patch(url, data);
    return response;
  };

  const put = async (url: string, data?: any): Promise<AxiosResponse> => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await axiosInstance!.put(url, data);
    return response;
  };

  return { get, post, patch, put, destroy };
};
const useWindow = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const [scrollPos, setScrollPos] = useState(0);
  // Function to check if an element is in view
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const resolution = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1440,
    "3xl": 1760,
  };

  useEffect(() => {
    if (window.innerWidth) {
      setWindowWidth(window.innerWidth);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (
        currentScrollPos > 0 &&
        currentScrollPos < document.documentElement.scrollHeight
      ) {
        setScrollDirection(currentScrollPos > scrollPos ? "down" : "up");
      }
      scrollPos = currentScrollPos;

      setScrollPos(scrollPos);
    };

    let scrollPos = window.pageYOffset;

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the scroll event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return { windowWidth, resolution, isInViewport, scrollDirection, scrollPos };
};

const useNavigation = () => {
  const { push, pathname, asPath } = useRouter();
  const { back, history } = useHistory();

  const goBack = () => {
    history.length === 0 || history[0] === asPath ? push("/") : back();
  };

  return { goBack, push };
};

export { useWindow, useNavigation, useBackend };
