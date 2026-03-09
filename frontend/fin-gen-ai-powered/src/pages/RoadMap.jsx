import React, { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType
} from "reactflow";

import "reactflow/dist/style.css";

import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress
} from "@mui/material";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { bankingRoadmap } from "../data/bankingRoadmap";



const RoadMap = () => {

  const topics = Object.keys(bankingRoadmap);

  const [topic, setTopic] = useState(topics[0]);

  const [completed, setCompleted] = useState({});

  const [content, setContent] = useState("");



  const sections = bankingRoadmap[topic];



  const connectorColors = [

    "#3b82f6",
    "#f59e0b",
    "#22c55e"

  ];



  const toggleStep = (id, step, section) => {

    const updated = { ...completed };

    updated[id] = !updated[id];

    setCompleted(updated);



    setContent(

`Topic: ${topic}

Section: ${section}

Concept: ${step}

Explanation:

${step} is part of custody banking production support. It ensures smooth transaction processing, monitoring, and reconciliation of financial operations across global markets.

Typical tasks include:
* Monitoring system alerts
* Investigating failures
* Coordinating with upstream/downstream systems
* Ensuring regulatory compliance.`

    );

  };



  const progress = useMemo(() => {

    const total = sections.reduce(

      (sum, s) => sum + s.steps.length,

      0

    );



    const done = Object.values(completed).filter(Boolean).length;



    return total === 0 ? 0 : Math.round((done / total) * 100);

  }, [completed, topic]);



  const { nodes, edges } = useMemo(() => {

    const nodes = [];

    const edges = [];



    let y = 0;



    sections.forEach((section, sIndex) => {

      const sectionId = `section-${sIndex}`;



      nodes.push({

        id: sectionId,

        position: { x: 0, y },

        data: {

          label: (

            <Box display="flex" alignItems="center">

              <AccountBalanceIcon sx={{ mr: 1 }} />

              {section.title}

            </Box>

          )

        },

        style: {

          background: "#020617",

          border: "1px solid #3b82f6",

          padding: 10,

          borderRadius: 8,

          color: "white"

        }

      });



      y += 120;



      section.steps.forEach((step, index) => {



        const nodeId = `${sIndex}-${index}`;



        nodes.push({

          id: nodeId,

          position: { x: 380, y },



          data: {

            label: (

              <Box

                onClick={() =>

                  toggleStep(

                    nodeId,

                    step,

                    section.title

                  )

                }



                sx={{

                  display: "flex",

                  alignItems: "center",

                  background:

                    completed[nodeId]

                      ? "#22c55e"

                      : "#1e293b",

                  color: "white",

                  p: 1.5,

                  borderRadius: 2,

                  cursor: "pointer",

                  width: 260

                }}

              >

                {completed[nodeId] ? (

                  <CheckCircleIcon

                    sx={{ mr: 1 }}

                  />

                ) : (

                  <TrendingUpIcon

                    sx={{ mr: 1 }}

                  />

                )}



                {step}

              </Box>

            )

          }

        });



        edges.push({

          id: `edge-${sectionId}-${nodeId}`,

          source: sectionId,

          target: nodeId,



          type: "smoothstep",



          style: {

            stroke:

              connectorColors[

                sIndex % 3

              ],

            strokeWidth: 3

          },



          markerEnd: {

            type: MarkerType.ArrowClosed,

            color:

              connectorColors[

                sIndex % 3

              ]

          }

        });



        y += 120;

      });



      y += 80;

    });



    return { nodes, edges };

  }, [topic, completed]);



  return (

    <Box

      sx={{

        minHeight: "100vh",

        background:

          "linear-gradient(135deg,#020617,#0f172a)",

        color: "white",

        p: 4,

        display: "flex"

      }}

    >



      {/* LEFT ROADMAP */}



      <Box sx={{ flex: 2 }}>



        <Typography

          variant="h4"

          mb={2}

        >

          FinGen Banking Roadmap

        </Typography>



        <Box mb={3}>



          {topics.map((t) => (

            <Button

              key={t}

              variant={

                topic === t

                  ? "contained"

                  : "outlined"

              }

              onClick={() => {

                setTopic(t);

                setCompleted({});

              }}

              sx={{ mr: 2, mb: 2 }}

            >

              {t}

            </Button>

          ))}

        </Box>



        {/* Progress */}



        <Box mb={2}>

          <Typography>

            Progress: {progress}%

          </Typography>

          <LinearProgress

            variant="determinate"

            value={progress}

          />

        </Box>



        {/* React Flow */}



        <div style={{ height: "75vh" }}>

          <ReactFlow

            nodes={nodes}

            edges={edges}

            fitView

            panOnScroll

            zoomOnScroll

          >

            <MiniMap />

            <Controls />

            <Background />

          </ReactFlow>

        </div>

      </Box>



      {/* RIGHT KNOWLEDGE PANEL */}



      <Box sx={{ flex: 1, ml: 3 }}>



        <Paper

          sx={{

            background: "#020617",

            color: "white",

            p: 3,

            height: "75vh",

            overflowY: "auto",

            border: "1px solid #334155"

          }}

        >



          <Typography

            variant="h6"

            mb={2}

          >

            Knowledge Viewer

          </Typography>



          <Typography

            sx={{ whiteSpace: "pre-wrap" }}

          >

            {content ||

              "Click a roadmap step to view details."}

          </Typography>



        </Paper>

      </Box>

    </Box>

  );

};



export default RoadMap;