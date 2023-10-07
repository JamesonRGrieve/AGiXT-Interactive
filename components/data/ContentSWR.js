import Typography from "@mui/material/Typography";
export default function ContentSWR({ swr, content, llms }) {
  console.log(llms);
  return swr.isLoading || llms == [] ? (
    <Typography variant="h6" component="h1" noWrap sx={{ fontWeight: "bold" }}>
      Loading...
    </Typography>
  ) : swr.error ? (
    <>
      <Typography
        variant="h6"
        component="h1"
        noWrap
        sx={{ fontWeight: "bold" }}
      >
        Error!
      </Typography>
      <Typography paragraph>{swr.error.message}</Typography>
    </>
  ) : (
    content({ data: swr.data, llms: llms })
  );
}
