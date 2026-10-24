"use client";

import { useEffect, useState } from "react";

type VisitRequest = {
  id: string;
  visitDate: string;
  visitTime: string;
  status: string;
  listing: { title: string };
};