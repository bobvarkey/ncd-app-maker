# Researcher Subagent

Search PubMed for neurology RCTs and meta-analyses.

## Usage

Run research on any topic:
```
researcher "stroke thrombectomy"
researcher "Alzheimer's treatment"
researcher "epilepsy surgery"
```

## What It Does

1. Scrapes PubMed for RCTs and meta-analyses
2. Returns titles, PMIDs, journals, URLs
3. Focuses on high-impact neurology papers

## Topics to Search

- Stroke / Thrombectomy
- Alzheimer's / Dementia
- Epilepsy
- Parkinson's
- Multiple Sclerosis
- Neurocritical Care
- Neurointervention
- Headache / Migraine

## Example Output

```json
[
  {
    "title": "Endovascular Thrombectomy for Large Vessel Occlusion...",
    "pmid": "12345678",
    "journal": "NEJM",
    "url": "https://pubmed.ncbi.nlm.nih.gov/12345678/"
  }
]
```
