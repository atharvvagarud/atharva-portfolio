import type { Project } from "@/types/project";

export function getProjectDestination(project: Project): string | null {
  return project.liveUrl || project.githubUrl;
}
