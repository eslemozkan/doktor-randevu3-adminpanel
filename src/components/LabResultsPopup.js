import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const LabResultsPopup = ({ open, onClose, labResults }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Laboratuvar Sonuçları</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test Adı</TableCell>
                <TableCell>Sonuç</TableCell>
                <TableCell>Referans Aralığı</TableCell>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabResultsPopup; 