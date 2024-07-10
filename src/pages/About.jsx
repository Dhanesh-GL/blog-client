import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

export default function About() {
  return (
    <Box sx={{ py: 4, px: { xs: 4, sm: 10, md: 30 }, height: "100%" }}>
      <Typography
        variant="h4"
        style={{
          marginBottom: "1rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        About Blog
      </Typography>{" "}
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Welcome to Blog!
          </AccordionSummary>
          <AccordionDetails>
          This blog was created as a personal project to share thoughts and ideas with the world. It focuses on technology, coding, and everything in between.







          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            About the Blog
          </AccordionSummary>
          <AccordionDetails>
          On this blog, you'll find weekly articles and tutorials on topics such as web development, software engineering, and programming languages. New technologies are always being explored, so be sure to check back often for new content!
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Community Engagement
          </AccordionSummary>
          <AccordionDetails>
          Comments and engagement with other readers are encouraged. You can like and reply to other people's comments. A community of learners can help each other grow and improve.
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
