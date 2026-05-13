import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setConnected, updateLiveData } from "../store/slices/liveSlice";

const WS_PROTOCOL = window.location.protocol === "https:" ? "wss" : "ws";
const IS_LOCALHOST = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const WS_URL = import.meta.env.VITE_WS_BASE_URL ||
  (IS_LOCALHOST ? `${WS_PROTOCOL}://${window.location.hostname}:5000/ws` : `${WS_PROTOCOL}://${window.location.host}/ws`);

export default function useWebSocket(pollId) {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const pollIdRef = useRef(pollId);
  const reconnectRef = useRef(null);
  const mountedRef = useRef(true);

  pollIdRef.current = pollId;

  useEffect(() => {
    mountedRef.current = true;

    if (!pollId) {
      dispatch(setConnected(false));
      return;
    }

    function connect() {
      // Don't connect if unmounted or pollId changed
      if (!mountedRef.current || !pollIdRef.current) return;

      try {
        const ws = new WebSocket(`${WS_URL}?pollId=${pollIdRef.current}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (mountedRef.current) {
            dispatch(setConnected(true));
          }
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;
          try {
            const data = JSON.parse(event.data);
            // Skip the CONNECTED confirmation message
            if (data.type !== "CONNECTED") {
              dispatch(updateLiveData(data));
            }
          } catch { }
        };

        ws.onclose = () => {
          if (mountedRef.current) {
            dispatch(setConnected(false));
            // Reconnect after 3s only if still mounted and same pollId
            reconnectRef.current = setTimeout(() => {
              if (mountedRef.current && pollIdRef.current === pollId) {
                connect();
              }
            }, 3000);
          }
        };

        ws.onerror = () => {
          // onclose will fire after this
        };
      } catch {
        dispatch(setConnected(false));
      }
    }

    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
      dispatch(setConnected(false));
    };
  }, [pollId, dispatch]);

  return wsRef;
}
