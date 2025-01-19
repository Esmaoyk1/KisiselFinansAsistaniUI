import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms'; // FormsModule'ü buradan içe aktarın
import { SavingApiService } from '../../services/saving.service';
import { HttpClientModule } from '@angular/common/http'; // İçe aktarın
@Component({
  selector: 'app-saving-update',
  standalone: true,
  imports: [RouterModule, FormsModule,HttpClientModule], // Burada FormsModule'ü ekleyin
  templateUrl: './saving-update.component.html',
  styleUrls: ['./saving-update.component.css']
})
export class SavingUpdateComponent implements OnInit {
  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private savingApiService: SavingApiService) {
    const id = this.route.snapshot.paramMap.get('id');
    //this.hedefId? = id;
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.post = navigation.extras.state['post'];
      this.post.targetDate = new Date(this.post.targetDate).toISOString().split('T')[0];
    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.post = {};
    }
  }

  ngOnInit() {
    this.hedefId = this.post.id; // Eğer post içinde id varsa
  }

  onUpdate(form: NgForm) {
    console
    if (form.valid && this.hedefId) {
      const updatedData = {
        goalName: this.post.goalName,
        goalAmount: this.post.goalAmount,
        savedAmount: this.post.savedAmount,
        targetDate: this.post.targetDate,
        id: this.hedefId
      };

      this.savingApiService.updatePost(this.hedefId, updatedData).subscribe(response => {
        
        console.log('Başarıyla güncellendi:', response);
        alert('Güncelleme işlemi başarıyla tamamlandı!');
        this.router.navigate(['/saving']);
      }, error => {
       
        console.error('Güncelleme hatası:', error);
        alert(error.error.message);
      });
    } else {
      console.log('Form geçersiz.');
    }
  }

}



//import { Component, OnInit } from '@angular/core';
//import { ParamMap, Router, RouterModule } from '@angular/router';
//import { MenuComponent } from '../../menu/menu.component';
//import { ActivatedRoute } from '@angular/router';
//import { FormsModule } from '@angular/forms';
//@Component({
//  selector: 'app-saving-update',
//  standalone: true,
//  imports: [RouterModule, MenuComponent, FormsModule],
//  templateUrl: './saving-update.component.html',
//  styleUrl: './saving-update.component.css'
//})

//export class SavingUpdateComponent implements OnInit {
//  hedefId: number | null = null; // Başlangıç değeri olarak null verildi
//  post: any;

//  constructor(private route: ActivatedRoute, private router: Router) {
//    const navigation = this.router.getCurrentNavigation();
//    this.post = null;
//    if (navigation && navigation.extras.state) {
//      this.post = navigation.extras.state['post'];
//      this.post.targetDate = new Date(this.post.targetDate).toISOString().split('T')[0];

//      console.log(this.post);
//    } else {
//      console.warn('Navigation veya state bulunamadı.');
//      this.post = {}; // Varsayılan değer
//    }
//  }
//  ngOnInit() {

//  }
//  ngOnDestroy(): void {
//    // Bileşen yok edilirken durumu temizle
//    this.post = null;
//  }


//}
