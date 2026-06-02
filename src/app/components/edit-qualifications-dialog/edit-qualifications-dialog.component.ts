import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericDataService } from '../../services/generic-data.service';

export interface Qualification {
  name: string;
  requirement_level: 'required' | 'preferred';
  years_experience: number | null;
}

@Component({
  selector: 'app-edit-qualifications-dialog',
  templateUrl: './edit-qualifications-dialog.component.html',
  styleUrls: ['./edit-qualifications-dialog.component.css']
})
export class EditQualificationsDialogComponent {
  qualifications: Qualification[] = [];
  requirementLevels = ['required', 'preferred'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditQualificationsDialogComponent>,
    private dataService: GenericDataService
  ) {
    this.parseQualifications(data.currentValue);
  }

  parseQualifications(jsonString: string): void {
    if (!jsonString) {
      this.qualifications = [];
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      this.qualifications = Object.entries(parsed).map(([name, details]: [string, any]) => ({
        name,
        requirement_level: details.requirement_level || 'preferred',
        years_experience: details.years_experience
      }));
    } catch (e) {
      console.error('Error parsing qualifications JSON:', e);
      this.qualifications = [];
    }
  }

  toJson(): string {
    const result: Record<string, any> = {};
    for (const qual of this.qualifications) {
      if (qual.name && qual.name.trim()) {
        result[qual.name.trim()] = {
          requirement_level: qual.requirement_level,
          years_experience: qual.years_experience || null
        };
      }
    }
    return JSON.stringify(result);
  }

  addQualification(): void {
    this.qualifications.push({
      name: '',
      requirement_level: 'preferred',
      years_experience: null
    });
  }

  removeQualification(index: number): void {
    this.qualifications.splice(index, 1);
  }

  save(): void {
    const jsonValue = this.toJson();
    const jobId = this.data.jobId;

    this.dataService.updateData(jobId, 'tier2_qualification_details', jsonValue, 'job', null, null).subscribe({
      next: () => {
        this.data.node.setDataValue('tier2_qualification_details', jsonValue);
        this.dialogRef.close(jsonValue);
      },
      error: () => alert('Update failed')
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
