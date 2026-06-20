import { NotFoundPage } from "~/components/not-found";

export function meta() {
  return [
    { title: "Page not found | Schick" },
    {
      name: "description",
      content: "The requested Schick page could not be found.",
    },
  ];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
