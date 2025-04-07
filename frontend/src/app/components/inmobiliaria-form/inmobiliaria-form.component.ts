import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Importaciones de Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inmobiliaria-form',
  templateUrl: './inmobiliaria-form.component.html',
  styleUrls: ['./inmobiliaria-form.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, 
    FormsModule, 
  ]
})
export class InmobiliariaFormComponent {
  constructor(
    public dialogRef: MatDialogRef<InmobiliariaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data); // Devuelve los datos al componente padre
  }
}