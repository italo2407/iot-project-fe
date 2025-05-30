import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import DynamicSelect from '~/components/DynamicSelect';
import LogFilter, { type LogFilters } from '~/components/LogFilter';
import LogViewer, { type LogItem } from '~/components/LogViewer';
import { useDevices } from '~/contexts/DeviceContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Log() {
  const { devices } = useDevices();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filters, setFilters] = useState<LogFilters>({
    type: '',
    device_id: '',
    from: '',
    to: '',
  }); // ajusta según tus filtros
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      type: filters.type || '',
      device_id: filters.device_id || '',
      from: filters.from || '',
      to: filters.to || '',
    });
    const res = await fetch(`${API_URL}/logs?${params.toString()}`);
    const { data } = await res.json();

    console.log('Fetched logs:', data);
    setLogs(prev => (reset ? data : [...prev, ...data]));
    setHasMore(data.length > 0); // o usa data.hasMore si tu API lo soporta
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(page === 1); // reset si es la primera página
    // eslint-disable-next-line
  }, [filters, page]);

  const handleFilter = (newFilters: LogFilters) => {
    setFilters(newFilters);
    setPage(1); // reinicia la paginación al cambiar filtros
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const lastLogRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Logs</h1>
      <p className="font-light mb-8">Visualize device logs.</p>

      {devices.length === 0 && (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-9xl text-slate-200"></FontAwesomeIcon>
          <h2 className="mt-8 font-light text-lg">
            No existen dispositivos registrados
          </h2>
          <p className="mt-4"></p>
        </div>
      )}

      {devices.length > 0 && (
        <>
          <LogFilter onFilter={handleFilter} />
          <LogViewer logs={logs} lastLogRef={lastLogRef} />
        </>
      )}
    </div>
  );
}
