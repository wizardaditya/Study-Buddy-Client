import { useParams } from "react-router-dom";
export default function ProjectDetail() {
  const { id } = useParams();
  return <div className="text-center py-20 text-muted-foreground">Project {id} — Full detail view coming soon.</div>;
}
