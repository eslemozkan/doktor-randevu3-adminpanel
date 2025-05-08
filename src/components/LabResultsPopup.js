import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TestResultSummary from './TestResultSummary';

const LabResultsPopup = ({ open, onClose, labResults, testImage }) => {
  // Laboratuvar sonuçlarını metin olarak birleştir
  const testText = labResults && labResults.length > 0
    ? labResults.map(r => `${r.testName}: ${r.result} (Referans: ${r.referenceRange})`).join('\n')
    : '';
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Laboratuvar Sonuçları</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Başlıklar kaldırıldı */}
              </TableRow>
            </TableHead>
            <TableBody>
              {labResults?.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.testName}</TableCell>
                  <TableCell>{result.result}</TableCell>
                  <TableCell>{result.referenceRange}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: 32 }}>
          <TestResultSummary isOpen={open} onClose={onClose} testImage={testImage} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabResultsPopup; 